const { cdk8s } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');
const project = new cdk8s.ConstructLibraryCdk8s({
  author: 'majordwarf',
  authorAddress: 'tejas.tank@smallcase.com',
  cdk8sVersion: '1.4.10',
  defaultReleaseBranch: 'main',
  name: '@smallcase/cdk8s-botkube',
  repositoryUrl: 'https://github.com/smallcase/cdk8s-botkube.git',
  release: true,
  npmAccess: NpmAccess.PUBLIC,
  npmignore: [
    '!configmap.yaml',
  ],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
