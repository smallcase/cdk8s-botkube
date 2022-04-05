import { Chart, Testing } from 'cdk8s';
import { BotKube } from '../src/index';

test('botkube-default', () => {

  const app = Testing.app();
  const chart = new Chart(app, 'test');

  new BotKube(chart, 'botkube-default');

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('botkube-configmap', () => {

  const app = Testing.app();
  const chart = new Chart(app, 'test');

  new BotKube(chart, 'botkube-default', {
    configMapData: 'testConfigMap',
  });

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('botkube-secrets', () => {

  const app = Testing.app();
  const chart = new Chart(app, 'test');

  new BotKube(chart, 'botkube-default', {
    secretName: 'testSecretName',
  });

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('botkube-nodeselector', () => {

  const app = Testing.app();
  const chart = new Chart(app, 'test');

  new BotKube(chart, 'botkube-default', {
    nodeSelector: { testing: 'test-key' },
  });

  expect(Testing.synth(chart)).toMatchSnapshot();
});

test('botkube-tolerations', () => {

  const app = Testing.app();
  const chart = new Chart(app, 'test');

  new BotKube(chart, 'botkube-default', {
    tolerations: [{
      effect: 'NoExecute',
      key: 'node.kubernetes.io/not-ready',
      operator: 'Exists',
      tolerationSeconds: 300,
    }],
  });

  expect(Testing.synth(chart)).toMatchSnapshot();
});
