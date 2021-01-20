import { Controller, Get } from '@nestjs/common';
import { getList } from './crawler/getList';

@Controller('resource')
export class ResourceController {
  @Get('search')
  async findOne() {
    return await getList();
  }
}
