import metadata from '../controllers-metadata.json';
import type ClientController from './ClientController';
import { clientizeController, defaultFetcher, type DefaultFetcherOptions } from '../../../src/client';
import { HttpException, SmoothieBody, SmoothieParams, SmoothieQuery, SmoothieReturnType } from '../../../src';
import { it, expect, describe } from '@jest/globals';

import { validateEqualityOnClient } from './validateEquality';

type ClientControllerType = typeof ClientController;

const prefix = 'http://localhost:' + process.env.PORT + '/api';

const defaultController = clientizeController<typeof ClientController, DefaultFetcherOptions>(
  metadata.ClientController,
  defaultFetcher,
  {
    defaultOptions: { prefix },
  }
);

describe('Client', () => {
  it(`Should handle simple requests + headers`, async () => {
    const noOptionsController = clientizeController<typeof ClientController, DefaultFetcherOptions>(
      metadata.ClientController,
      defaultFetcher
    );
    const result = await noOptionsController.getHelloWorld({
      prefix,
      headers: { 'x-test': 'world' },
    });
    expect(result satisfies { hello: string | null }).toEqual({ hello: 'world' });
  });

  it(`Should handle simple requests with default options`, async () => {
    const result = await defaultController.getHelloWorld({
      headers: { 'x-test': 'world' },
    });
    expect(result satisfies { hello: string | null }).toEqual({ hello: 'world' });
  });

  it('Should handle requests with params', async () => {
    const result = await defaultController.getWithParams({
      params: { hello: 'world' },
    });

    type Params = SmoothieParams<ClientControllerType['getWithParams']>;

    null as unknown as SmoothieParams<ClientControllerType['getWithParams']> satisfies Params;
    // @ts-expect-error Expect error
    null as unknown as SmoothieBody<ClientControllerType['getWithParams']> satisfies { hello: 'world' };
    null as unknown as SmoothieBody<ClientControllerType['getWithParams']> satisfies undefined;

    // @ts-expect-error Expect error
    null as unknown as SmoothieQuery<ClientControllerType['getWithParams']> satisfies { hello: 'world' };
    null as unknown as SmoothieQuery<ClientControllerType['getWithParams']> satisfies undefined;

    expect(result satisfies { hello: 'world' }).toEqual({ hello: 'world' });
  });

  it('Should handle requests with params, body and query', async () => {
    const result = await defaultController.postWithParams({
      params: { hello: 'world' },
      body: { isBody: true },
      query: { query: 'queryValue' },
    });

    type Body = SmoothieBody<ClientControllerType['postWithParams']>;

    type Query = SmoothieQuery<ClientControllerType['postWithParams']>;

    type Params = SmoothieParams<ClientControllerType['postWithParams']>;

    null as unknown as SmoothieBody<ClientControllerType['postWithParams']> satisfies Body;
    // @ts-expect-error Expect error
    null as unknown as SmoothieBody<ClientControllerType['postWithParams']> satisfies { hello: 'foo' };

    null as unknown as SmoothieQuery<ClientControllerType['postWithParams']> satisfies Query;
    // @ts-expect-error Expect error
    null as unknown as SmoothieQuery<ClientControllerType['postWithParams']> satisfies { query: 'bar' };

    null as unknown as SmoothieParams<ClientControllerType['postWithParams']> satisfies Params;
    // @ts-expect-error Expect error
    null as unknown as SmoothieBody<ClientControllerType['postWithParams']> satisfies { hello: 'baz' };

    expect(result satisfies SmoothieReturnType<ClientControllerType['postWithParams']>).toEqual({
      params: { hello: 'world' },
      body: { isBody: true },
      query: { query: 'queryValue' },
    });
  });

  it('Should handle basic client validation', async () => {
    const clientValidationController = clientizeController<typeof ClientController, DefaultFetcherOptions>(
      metadata.ClientController,
      defaultFetcher,
      {
        defaultOptions: { prefix },
        validateOnClient: validateEqualityOnClient,
      }
    );

    const result = await clientValidationController.postWithEqualityValidation({
      body: { hello: 'body' },
      query: { hey: 'query' },
    });

    expect(result satisfies { body: { hello: string }; query: { hey: string } }).toEqual({
      body: { hello: 'body' },
      query: { hey: 'query' },
    });

    await expect(async () => {
      await clientValidationController.postWithEqualityValidation({
        body: { hello: 'wrong' },
        query: { hey: 'query' },
      });
    }).rejects.toThrow(/Client exception. Invalid body/);

    await expect(async () => {
      await clientValidationController.postWithEqualityValidation({
        body: { hello: 'wrong' },
        query: { hey: 'query' },
      });
    }).rejects.toThrowError(HttpException);

    await expect(async () => {
      await clientValidationController.postWithEqualityValidation({
        body: { hello: 'body' },
        query: { hey: 'wrong' },
      });
    }).rejects.toThrow(/Client exception. Invalid query/);

    await expect(async () => {
      await clientValidationController.postWithEqualityValidation({
        body: { hello: 'body' },
        query: { hey: 'wrong' },
      });
    }).rejects.toThrowError(HttpException);
  });

  it('Should handle basic server validation', async () => {
    const serverValidationController = clientizeController<typeof ClientController, DefaultFetcherOptions>(
      metadata.ClientController,
      defaultFetcher,
      {
        defaultOptions: { prefix },
        validateOnClient: validateEqualityOnClient,
        disableClientValidation: true,
      }
    );

    const result = await serverValidationController.postWithEqualityValidation({
      body: { hello: 'body' },
      query: { hey: 'query' },
    });

    expect(result satisfies { body: { hello: string }; query: { hey: string } }).toEqual({
      body: { hello: 'body' },
      query: { hey: 'query' },
    });

    await expect(async () => {
      await serverValidationController.postWithEqualityValidation({
        body: { hello: 'wrong' },
        query: { hey: 'query' },
      });
    }).rejects.toThrow(/Server exception. Invalid body/);

    await expect(async () => {
      await serverValidationController.postWithEqualityValidation({
        body: { hello: 'wrong' },
        query: { hey: 'query' },
      });
    }).rejects.toThrowError(HttpException);

    await expect(async () => {
      await serverValidationController.postWithEqualityValidation({
        body: { hello: 'body' },
        query: { hey: 'wrong' },
      });
    }).rejects.toThrow(/Server exception. Invalid query/);

    await expect(async () => {
      await serverValidationController.postWithEqualityValidation({
        body: { hello: 'body' },
        query: { hey: 'wrong' },
      });
    }).rejects.toThrowError(HttpException);
  });

  // zod validation
});
