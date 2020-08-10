/* eslint-disable no-undef */
import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
} from '@loopback/core';
import {Socket} from 'socket.io';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('websocket')
export class WebsocketBridgeObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: Application,
  ) {
    console.log('WebSocketBridge observer is initialized');
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    console.log('WebSocketBridge observer is started');

    const io = require('socket.io')(this.app);

    io.attach(8081, {
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });

    this.app.bind('websocket').to(io);

    io.on('connection', async function (socket: Socket) {
      console.log(
        'Client with ID: [' +
          socket.client.id +
          '] Connected to WebSocket endpoint',
      );
    });
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
    console.log('WebSocketBridge stop');
  }
}
