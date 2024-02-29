import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from '../impl/ProjectCreated.event';
import { Logger } from '@nestjs/common';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedEventHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  logger = new Logger('ProjectCreatedEventHandler');
  channel_id;
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly configService: ConfigService,
  ) {
    this.channel_id = this.configService.get('CHANNEL_ID');
  }

  async handle(event: ProjectCreatedEvent) {
    const { payload } = event;
    this.logger.log('Project created event handler');

    const channel = (await this.client.channels.cache.get(
      this.channel_id,
    )) as TextChannel;
    const message = new EmbedBuilder();
    message.setURL(
      `https://github.com/orgs/OpenSDN-io/projects/${payload.projects_v2.number}`,
    );
    message.setTitle(`Project created: ${payload.projects_v2.title}`);
    message.setAuthor({
      name: '@' + payload.sender.login,
      iconURL: payload.sender.avatar_url,
    });
    await channel.send({ embeds: [message] });
  }
}
