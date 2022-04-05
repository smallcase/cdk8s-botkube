import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';
export * as k8s from './imports/k8s';

export interface BotKubeOptions {
  /**
   * Your BotKube communication secret name.
   *
   * @default - botkube-communication-secret
   */
  readonly secretName?: string;

  /**
   * String formatted in YAML format defining your BotKube monitoring configuration.
   *
   * @default - botkube default
   */
  readonly configMapData?: string;

  /**
   * Number of BotKubt replicas to be spawned.
   *
   * @default - 1
   */
  readonly replicas?: number;

  /**
   * Node selector value for the BotKube deployment.
   *
   * @default - empty object
   */
  readonly nodeSelector?: { [key: string]: string };

  /**
   * Tolerations value for the BotKube deployment.
   *
   * @default - empty array
   */
  readonly tolerations?: k8s.Toleration[];
}

export class BotKube extends Construct {
  constructor(scope: Construct, id: string, options?: BotKubeOptions) {
    super(scope, id);

    const configMap = fs
      .readFileSync(path.resolve(__dirname, '../configmap.yaml'), 'utf-8')
      .split('\n');
    const secretName = options?.secretName ?? 'botkube-communication-secret';
    const configMapData = options?.configMapData ?? JSON.stringify(configMap);
    const replicas = options?.replicas ?? 1;
    const nodeSelector = options?.nodeSelector ?? {};
    const tolerations = options?.tolerations ?? [];

    new k8s.KubeConfigMap(this, 'botkube-config-map', {
      metadata: {
        name: 'botkube-configmap',
        labels: {
          app: 'botkube',
        },
      },
      data: {
        'resource_config.yaml': configMapData,
      },
    });

    new k8s.KubeServiceAccount(this, 'botkube-service-account', {
      metadata: {
        name: 'botkube-service-account',
        labels: {
          app: 'botkube',
        },
      },
    });

    new k8s.KubeClusterRole(this, 'botkube-cluster-role', {
      metadata: {
        name: 'botkube-cluster-role',
      },
      rules: [
        {
          apiGroups: ['*'],
          resources: ['*'],
          verbs: ['get', 'watch', 'list'],
        },
      ],
    });

    new k8s.KubeClusterRoleBinding(this, 'botkube-cluster-role-binding', {
      metadata: {
        name: 'botkube-service-account',
        labels: {
          app: 'botkube',
        },
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'botkube-clusterrole',
      },
      subjects: [
        {
          kind: 'ServiceAccounts',
          name: 'botkube-service-account',
        },
      ],
    });

    new k8s.KubeDeployment(this, 'botkube', {
      metadata: {
        name: 'botkube',

        labels: {
          component: 'controller',
          app: 'botkube',
        },
      },
      spec: {
        replicas: replicas,
        selector: {
          matchLabels: {
            component: 'controller',
            app: 'botkube',
          },
        },
        template: {
          metadata: {
            labels: {
              component: 'controller',
              app: 'botkube',
            },
          },
          spec: {
            serviceAccountName: 'botkube-sa',
            nodeSelector: nodeSelector,
            tolerations: tolerations,
            containers: [
              {
                name: 'botkube',
                image: 'ghcr.io/infracloudio/botkube:v0.12.4',
                imagePullPolicy: 'IfNotPresent',
                volumeMounts: [
                  {
                    name: 'config-volume',
                    mountPath: '/config',
                  },
                ],
                env: [
                  {
                    name: 'CONFIG_PATH',
                    value: '/config/',
                  },
                  {
                    name: 'LOG_LEVEL',
                    value: 'info',
                  },
                ],
              },
            ],
            volumes: [
              {
                name: 'config-volume',
                projected: {
                  sources: [
                    {
                      configMap: {
                        name: 'botkube-config-map',
                      },
                    },
                    {
                      secret: {
                        name: secretName,
                      },
                    },
                  ],
                },
              },
            ],
            securityContext: {
              runAsUser: 101,
              runAsGroup: 101,
            },
          },
        },
      },
    });
  }
}
