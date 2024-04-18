import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common/decorators'

import { BasicsService } from './basics.service'
import { UseZodValidation } from 'src/decorators/zod.decorator'
import { BasicDto, basicDto } from './basics.validator'

@Controller('admin/basics')
export class BasicsController {
  constructor(private readonly basicsService: BasicsService) {}

  @Get()
  getAll(@Query('group_id') groupId?: string) {
    return this.basicsService.getAll(groupId)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.basicsService.getOne(id)
  }

  @Get('shell/:shell')
  getByShell(@Param('shell') shell: string) {
    return this.basicsService.getByShell(shell)
  }

  @Post()
  @UseZodValidation(basicDto)
  create(@Body() body: BasicDto) {
    return this.basicsService.create(body)
  }

  @Put(':id')
  @UseZodValidation(basicDto)
  update(@Param('id') id: string, @Body() body: BasicDto) {
    return this.basicsService.update(id, body)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.basicsService.delete(id)
  }
}
