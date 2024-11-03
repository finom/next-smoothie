import { prefix, get, put, post, del } from 'vovk';
import { withZod } from 'vovk-zod';
import { z } from 'zod';

import ZodControllerAndServiceEntityService from './ZodControllerAndServiceEntityService';

@prefix('zod-controller-and-service-entity')
export default class ZodControllerAndServiceEntityController {
  @get()
  static getZodControllerAndServiceEntities = withZod(null, z.object({ search: z.string() }), (req) => {
    const search = req.nextUrl.searchParams.get('search');

    return ZodControllerAndServiceEntityService.getZodControllerAndServiceEntities(search);
  });

  @put(':id')
  static updateZodControllerAndServiceEntity = withZod(
    z.object({
      foo: z.union([z.literal('bar'), z.literal('baz')]),
    }),
    z.object({ q: z.string() }),
    async (req, params: { id: string }) => {
      const { id } = params;
      const body = await req.json();
      const q = req.nextUrl.searchParams.get('q');

      return ZodControllerAndServiceEntityService.updateZodControllerAndServiceEntity(id, q, body);
    }
  );

  @post()
  static createZodControllerAndServiceEntity = () => {
    // ...
  };

  @del(':id')
  static deleteZodControllerAndServiceEntity = () => {
    // ...
  };
}