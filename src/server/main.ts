import 'reflect-metadata';
import { Body, Controller, Get, Module, Post, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join, resolve } from 'node:path';

// Without a mounted persistent volume this directory is TEMPORARY on cloud hosts.
// For persistence, mount a DockHosting volume at /data and set DATA_DIR=/data.
const DATA_DIR = resolve(process.env.DATA_DIR || join(process.cwd(), 'data'));
const DATA_FILE = join(DATA_DIR, 'messages.json');
const BOOT_ID = randomUUID().slice(0, 8);

type Message = { id: string; text: string; createdAt: string };

function readMessages(): Message[] {
  mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(readFileSync(DATA_FILE, 'utf8')) as unknown;
  if (!Array.isArray(raw)) throw new Error('Invalid stored JSON format');
  return raw as Message[];
}

function saveMessages(items: Message[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = join(DATA_DIR, `messages.${process.pid}.tmp`);
  writeFileSync(tmp, JSON.stringify(items, null, 2), 'utf8');
  renameSync(tmp, DATA_FILE);
}

@Controller('api')
class TestController {
  @Get('health')
  health() {
    const items = readMessages();
    return {
      ok: true,
      service: 'Poulstar - NestJS + React',
      bootId: BOOT_ID,
      total: items.length,
      storageDir: DATA_DIR,
      configuredForPersistentVolume: Boolean(process.env.DATA_DIR),
      reminder: 'DATA_DIR alone is not enough: mount a persistent volume at the same path.'
    };
  }

  @Get('messages')
  all() {
    return { items: readMessages() };
  }

  @Post('messages')
  add(@Body() body: { text?: unknown }) {
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!text || text.length > 100) {
      throw new BadRequestException('Text must be between 1 and 100 characters.');
    }
    const items = readMessages();
    const item: Message = { id: randomUUID(), text, createdAt: new Date().toISOString() };
    items.unshift(item);
    saveMessages(items.slice(0, 100));
    return { saved: true, item };
  }
}

@Module({ controllers: [TestController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'web-dist'));
  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`Poulstar test online: 0.0.0.0:${port} | data: ${DATA_DIR} | boot: ${BOOT_ID}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
