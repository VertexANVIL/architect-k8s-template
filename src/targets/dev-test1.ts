import { KubeTarget, ClusterFlavor } from '@arctarus/architect-k8s/src';
import { SemVer } from 'semver';

import * as components from './../components';

const cluster = new KubeTarget({
  name: 'dev-test1',
  client: {
    context: 'docker-desktop',
  },
  dns: 'k8s.localdomain',
  version: new SemVer('v1.25.2'),

  podNetwork: {
    ipFamilies: ['IPv4'],
  },

  flavor: ClusterFlavor.DockerDesktop,
}, {
  modes: {
    flux: {
      sourceRef: {
        kind: 'Bucket',
        name: 'cluster',
        namespace: 'flux-system',
      },
    },
  },
});

cluster.enable(components.IngressNginxComponent);

export default cluster;
