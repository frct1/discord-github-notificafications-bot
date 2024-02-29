import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { PROJECT_EVENT_HANDLERS } from './events/handlers';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...PROJECT_EVENT_HANDLERS],
})
export class AppModule {}
