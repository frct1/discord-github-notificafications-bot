import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectUpdatedEvent } from '../impl/ProjectUpdated.event';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@EventsHandler(ProjectUpdatedEvent)
export class ProjectUpdatedEventHandler
  implements IEventHandler<ProjectUpdatedEvent>
{
  logger = new Logger('ProjectUpdatedEventHandler');
  channel_id = null;
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly configService: ConfigService,
  ) {
    this.channel_id = this.configService.get('CHANNEL_ID');
  }

  async handle(event: ProjectUpdatedEvent) {
    this.logger.log('Project updated event handler');
    const { payload } = event;
    const channel = (await this.client.channels.cache.get(
      this.channel_id,
    )) as TextChannel;
    const message = new EmbedBuilder();
    message.setTitle(`Project updated: ${payload.projects_v2.title}`);
    message.setURL(
      `https://github.com/orgs/OpenSDN-io/projects/${payload.projects_v2.number}`,
    );
    message.setAuthor({
      name: '@' + payload.sender.login,
      iconURL: payload.sender.avatar_url,
    });
    await channel.send({ embeds: [message] });
  }
}
