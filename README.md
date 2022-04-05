# CDK8S BotKube

`cdk8s-botkube` is an open-source construct library for cdk8s to deploy a configurable instance of BotKube to your Kubernetes cluster. BotKube is a messaging bot for monitoring and debugging Kubernetes clusters.
You provide the configuration for BotKube, our construct library does the rest of the magic.

[Official website](https://www.botkube.io/)

## Installation

Install using NPM:

```
npm install @smallcase/cdk8s-botkube
```

Using yarn

```
yarn add @smallcase/cdk8s-botkube
```

### Configuration Helper

| Property      | Type                      | Default                              | Description                                                                                                 |
| ------------- | ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| secretName    | string                    | botkube-communication-secret         | Your BotKube communication secret name (Read below to see how to define your secret)                        |
| configMapData | string                    | [./configmap.yaml](./configmap.yaml) | YAML formatted string defining your BotKube monitoring config (Read below to see how to define your config) |
| replicas      | number                    | 1                                    | Number of pod replicas for deployment                                                                       |
| nodeSelector  | { [key: string]: string } | {}                                   | Node selectors for the BotKube deployment                                                                   |
| tolerations   | k8s.Toleration[]          | []                                   | Tolerations for the BotKube deployment                                                                      |

## Setting Up Secrets:

Since the communication configuration contains sensitive information like webhook and application tokens we recommend you deploy the configuration as a secret.

Template:

```
apiVersion: v1
kind: Secret
metadata:
  name: botkube-communication-secret
  labels:
    app: botkube
type: Opaque
stringData:
  comm_config.yaml: |
    ...
```

Fill in the communication secret as per your requirements, have a look at BotKube's official documentation [here](https://www.botkube.io/configuration/#comm_configyaml-syntax) to get an idea of the syntax.

## Setting Up the Resource Config

You can customize alerts from BotKube as per your needs by tweaking its config. You can leave this field empty and a [default config](./configmap.yaml) will be added, or you can specify a custom YAML config. See resource config syntax [here](https://www.botkube.io/configuration/#resource_configyaml-syntax).

## Using the construct

Import the library in your CDK8s project and pass the necessary parameters to the construct.

Example:

```
new BotKube(this, 'botkube-default', {
  secretName: 'my-secret-name',
  configMapData: 'Foo',
  replicas: 2
});
```
