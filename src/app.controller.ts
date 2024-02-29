import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Logger,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, TextChannel } from 'discord.js';
import { ProjectUpdatedEvent } from './events/impl/ProjectUpdated.event';
import { EventBus } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from './events/impl/ProjectCreated.event';

@Controller()
export class AppController {
  logger = new Logger('App');
  constructor(
    private readonly appService: AppService,
    private readonly eventBus: EventBus,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Get('/webhook')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/webhook')
  async processWebhook(
    @Body() body,
    @Headers('X-GitHub-Event') githubEvent,
  ): Promise<string> {
    this.logger.log('event: ', githubEvent);
    this.logger.log(`payload:`, body);
    if (githubEvent == 'projects_v2') {
      // This is project related event
      let event;
      switch (body.action) {
        case 'edited':
          event = new ProjectUpdatedEvent(body);
          break;
        case 'created':
          event = new ProjectCreatedEvent(body);
          break;
        default:
          break;
      }
      if (event) {
        this.eventBus.publish(event);
      }
      // This is project related webhook
    }
    return 'OK';
  }
}
