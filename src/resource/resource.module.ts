import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceResolver } from './resource.resolver';
import { ResourceController } from './resource.controller';

@Module({
  providers: [ResourceResolver, ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
