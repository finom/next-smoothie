import {
  NoValidationControllerOnlyEntityRPC,
  NoValidationControllerServiceAndWorkerEntityRPC,
  ZodControllerOnlyEntityRPC,
  ZodControllerAndServiceEntityRPC,
  YupControllerOnlyEntityRPC,
  YupControllerAndServiceEntityRPC,
} from '../../.vovk-client/client';
import { it, expect, describe } from '@jest/globals';

describe('Generated modules', () => {
  const rpcs = {
    'Controller only with no validation': {
      create: NoValidationControllerOnlyEntityRPC.createNoValidationControllerOnlyEntity,
      read: NoValidationControllerOnlyEntityRPC.getNoValidationControllerOnlyEntities,
      update: NoValidationControllerOnlyEntityRPC.updateNoValidationControllerOnlyEntity,
      delete: NoValidationControllerOnlyEntityRPC.deleteNoValidationControllerOnlyEntity,
    },
    'Controller and service with no validation': {
      create: NoValidationControllerServiceAndWorkerEntityRPC.createNoValidationControllerServiceAndWorkerEntity,
      read: NoValidationControllerServiceAndWorkerEntityRPC.getNoValidationControllerServiceAndWorkerEntities,
      update: NoValidationControllerServiceAndWorkerEntityRPC.updateNoValidationControllerServiceAndWorkerEntity,
      delete: NoValidationControllerServiceAndWorkerEntityRPC.deleteNoValidationControllerServiceAndWorkerEntity,
    },
    'Controller only with Zod': {
      create: ZodControllerOnlyEntityRPC.createZodControllerOnlyEntity,
      read: ZodControllerOnlyEntityRPC.getZodControllerOnlyEntities,
      update: ZodControllerOnlyEntityRPC.updateZodControllerOnlyEntity,
      delete: ZodControllerOnlyEntityRPC.deleteZodControllerOnlyEntity,
    },
    'Controller and service with Zod': {
      create: ZodControllerAndServiceEntityRPC.createZodControllerAndServiceEntity,
      read: ZodControllerAndServiceEntityRPC.getZodControllerAndServiceEntities,
      update: ZodControllerAndServiceEntityRPC.updateZodControllerAndServiceEntity,
      delete: ZodControllerAndServiceEntityRPC.deleteZodControllerAndServiceEntity,
    },
    'Controller only with Yup': {
      create: YupControllerOnlyEntityRPC.createYupControllerOnlyEntity,
      read: YupControllerOnlyEntityRPC.getYupControllerOnlyEntities,
      update: YupControllerOnlyEntityRPC.updateYupControllerOnlyEntity,
      delete: YupControllerOnlyEntityRPC.deleteYupControllerOnlyEntity,
    },
    'Controller and service with Yup': {
      create: YupControllerAndServiceEntityRPC.createYupControllerAndServiceEntity,
      read: YupControllerAndServiceEntityRPC.getYupControllerAndServiceEntities,
      update: YupControllerAndServiceEntityRPC.updateYupControllerAndServiceEntity,
      delete: YupControllerAndServiceEntityRPC.deleteYupControllerAndServiceEntity,
    },
  } as const;

  for (const [blockName, rpc] of Object.entries(rpcs)) {
    describe(blockName, () => {
      it('Update', async () => {
        const result = await rpc.update({
          params: { id: 'id_1' },
          query: { q: 'hello' },
          body: { foo: 'bar' },
        });

        const expectedResult = {
          id: 'id_1',
          body: { foo: 'bar' },
          q: 'hello',
        };

        expect(result satisfies typeof expectedResult).toEqual(expectedResult);
      });

      it('Get', async () => {
        const result = await rpc.read({
          query: { search: 'hello' },
        });

        const expectedResult = {
          results: [],
          search: 'hello',
        };

        expect(result satisfies typeof expectedResult).toEqual(expectedResult);
      });

      it('Other methods', async () => {
        expect(typeof rpc.create).toEqual('function');
        expect(typeof rpc.delete).toEqual('function');
      });
    });
  }
});