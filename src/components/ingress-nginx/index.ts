import 'reflect-metadata';

import { IComponentMatcher } from '@arctarus/architect/src';
import * as k8s from '@arctarus/architect-k8s/src';
import { IngressCapability, IngressFlavor } from '@arctarus/architect-k8s/src';


@Reflect.metadata('name', 'ingress-nginx')
@Reflect.metadata('uuid', 'b2d8a201-3cb4-48af-8c5a-51b2b0a8c0af')
export class IngressNginxComponent extends k8s.KubeComponent {
  public async build(resources: k8s.KubeComponentGenericResources = {}) {
    const values = {
      ingressClassResource: {
        default: true,
      },
    };

    resources.result = await this.helmTemplate('ingress-nginx', values, {
      noHooks: false,
      repo: 'https://kubernetes.github.io/ingress-nginx',
      version: '4.1.0',
    });

    return super.build(resources);
  };

  public get capabilities() {
    return [
      new IngressCapability({
        flavor: IngressFlavor.Nginx,
      }),
    ];
  };

  public get requirements(): IComponentMatcher[] {
    return [];
  };

  public get namespace(): string {
    return this.cluster.ns?.features!;
  };
};
