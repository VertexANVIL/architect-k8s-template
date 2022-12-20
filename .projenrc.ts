import * as k8s from '@arctarus/architect-k8s';

const project = new k8s.ArchitectK8sTypeScriptApp({
  // change this to your organisation's details
  authorName: 'Arctarus Limited',
  authorOrganization: true,
  authorEmail: 'info@arctarus.co.uk',
  authorUrl: 'https://www.arctarus.co.uk',

  defaultReleaseBranch: 'main',
  name: '@arctarus/architect-k8s-template',
  license: 'MIT',
  repository: 'https://github.com/ArctarusLimited/architect-k8s-template.git',

  projenrcTs: true,

  // disable tests
  jest: false,
});

project.synth();
