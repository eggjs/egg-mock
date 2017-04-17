import { Application, Context } from 'egg';

declare module 'egg' {
  export interface Application { // tslint:disble-line
    ready(): Promise<void>;
    close(): Promise<void>;
    callback(): any;

    /**
     * mock Context
     */
    mockContext(data?: any): Context;

    /**
     * mock cookie session
     */
    mockSession(data: any): Application;

    mockCookies(cookies: any): Application;

    mockHeaders(headers: any): Application;

    /**
     * Mock service
     */
    mockService(service: string, methodName: string, fn: any): Application;

    /**
     * mock service that return error
     */
    mockServiceError(service: string, methodName: string, err?: Error): Application;

    mockHttpclient(mockUrl: string, mockMethod: string | string[], mockResult: {
      data?: Buffer | string | JSON;
      status?: number;
      headers?: any;
    }): Application;

    mockHttpclient(mockUrl: string, mockResult: {
      data?: Buffer | string | JSON;
      status?: number;
      headers?: any;
    }): Application;

    /**
     * mock csrf
     */
    mockCsrf(): Application;

    /**
     * http request helper
     */
    httpRequest(): any;
  }

}

interface MockOption {
  /**
   * The directory of the application
   */
  baseDir?: string;

  /**
   * Custom you plugins
   */
  plugins?: any;

  /**
   * The directory of the egg framework
   */
  framework?: string;

  /**
   * Cache application based on baseDir
   */
  cache?: boolean;

  /**
   * Swtich on process coverage, but it'll be slower
   */
  coverage?: boolean;

  /**
   * Remove $baseDir/logs
   */
  clean?: boolean;
}

type EnvType = 'default' | 'test' | 'prod' | 'local' | 'unittest';
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';

interface EggMock {
  /**
   * Create a egg mocked application
   */
  app(option?: MockOption): Application;

  /**
   * Create a mock cluster server, but you can't use API in application, you should test using supertest
   */
  cluster(option?: MockOption): Application;

  /**
   * mock the serverEnv of Egg
   */
  env(env: EnvType): void;

  /**
   * mock console level
   */
  consoleLevel(level: LogLevel): void;

  /**
   * set EGG_HOME path
   */
  home(homePath: string): void;

  /**
   * restore mock
   */
  restore(): void;
}

declare var mm: EggMock;

export = mm;
