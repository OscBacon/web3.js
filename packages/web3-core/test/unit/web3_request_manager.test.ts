import { InvalidResponseError, Web3BaseProvider } from 'web3-common';
import {
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
} from '../../../web3-common/src/types';
import { Web3RequestManager, Web3RequestManagerEvent } from '../../src/web3_request_manager';
import * as utils from '../../src/utils';

describe('Web3RequestManager', () => {
	describe('constructor', () => {
		it('should create instance of request manager without any params', () => {
			const manager = new Web3RequestManager();

			expect(manager).toBeInstanceOf(Web3RequestManager);
		});

		it('should create instance of request manager without given provider', () => {
			const provider = 'http://mydomain.com';
			jest.spyOn(Web3RequestManager.prototype, 'setProvider').mockReturnValue();

			const manager = new Web3RequestManager(provider);

			expect(manager.setProvider).toHaveBeenCalledTimes(1);
			expect(manager.setProvider).toHaveBeenCalledWith(provider, undefined);
			expect(manager).toBeInstanceOf(Web3RequestManager);
		});
	});

	describe('providers', () => {
		it('should return providers on instance', () => {
			const manager = new Web3RequestManager();

			expect(manager.providers).toMatchSnapshot();
		});

		it('should return providers on class', () => {
			expect(Web3RequestManager.providers).toMatchSnapshot();
		});
	});

	describe('setProvider()', () => {
		let myProvider: Web3BaseProvider;
		let emitSpy: jest.Mock;

		beforeEach(() => {
			myProvider = { request: jest.fn() } as any;
			emitSpy = jest.spyOn(Web3RequestManager.prototype, 'emit') as jest.Mock;
		});

		describe('http provider', () => {
			it('should detect and set http provider', () => {
				const providerString = 'http://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(Web3RequestManager.providers.HttpProvider).toHaveBeenCalledTimes(1);
				expect(Web3RequestManager.providers.HttpProvider).toHaveBeenCalledWith(
					providerString,
				);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'http://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('https provider', () => {
			it('should detect and set http provider', () => {
				const providerString = 'https://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(Web3RequestManager.providers.HttpProvider).toHaveBeenCalledTimes(1);
				expect(Web3RequestManager.providers.HttpProvider).toHaveBeenCalledWith(
					providerString,
				);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'https://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('ws provider', () => {
			it('should detect and set ws provider', () => {
				const providerString = 'ws://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					WebsocketProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(Web3RequestManager.providers.WebsocketProvider).toHaveBeenCalledTimes(1);
				expect(Web3RequestManager.providers.WebsocketProvider).toHaveBeenCalledWith(
					providerString,
				);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'ws://mydomain.com';

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					WebsocketProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('ipc provider', () => {
			it('should detect and set ipc provider', () => {
				const providerString = 'ipc://mydomain.com';
				const socket = { connect: () => jest.fn() } as any;

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					IpcProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString, socket);

				expect(Web3RequestManager.providers.IpcProvider).toHaveBeenCalledTimes(1);
				expect(Web3RequestManager.providers.IpcProvider).toHaveBeenCalledWith(
					providerString,
					socket,
				);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'ipc://mydomain.com';
				const socket = { connect: () => jest.fn() } as any;

				jest.spyOn(Web3RequestManager, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.providers,
					IpcProvider: jest.fn().mockImplementation(() => myProvider),
				});

				const manager = new Web3RequestManager();
				manager.setProvider(providerString, socket);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		it('should throw error if can not detect the provider', () => {
			const providerString = 'pc://mydomain.com';
			const manager = new Web3RequestManager();

			expect(() => manager.setProvider(providerString)).toThrow(
				`Can't autodetect provider for "pc://mydomain.com'"`,
			);
		});
	});

	describe('send()', () => {
		let request: any;
		let errorResponse: JsonRpcResponseWithError;
		let successResponse: JsonRpcResponseWithResult;

		beforeEach(() => {
			request = { method: 'my_method', params: {} };
			errorResponse = {
				id: 1,
				jsonrpc: '2.0',
				error: { code: 123, message: 'my-rejected-value' },
			};
			successResponse = {
				id: 1,
				jsonrpc: '2.0',
				result: 'my-resolved-value',
			};
		});

		it('should throw error if no provider is set', async () => {
			const manager = new Web3RequestManager();

			await expect(
				manager.send({ method: 'eth_getBlockByHash', params: ['123', true] }),
			).rejects.toThrow('Provider not available');
		});

		describe('web3-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(request);
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow('my-error');
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(request);
			});
		});

		describe('legacy-request-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(errorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});
		});

		describe('legacy-send-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toEqual(errorResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(errorResponse),
				);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(
					{ ...request, id: 1, jsonrpc: '2.0' },
					expect.any(Function),
				);
			});
		});

		describe('legacy-send-async-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith({
					...request,
					jsonrpc: '2.0',
					id: 1,
				});
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow('my-error');
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith({
					...request,
					jsonrpc: '2.0',
					id: 1,
				});
			});
		});
	});
});
