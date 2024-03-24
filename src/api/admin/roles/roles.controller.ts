import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators'

import { RolesService } from './roles.service'
import { RoleDto, roleDto } from './roles.validator'
import { UseZodValidation } from 'src/decorators/zod.decorator'

@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAll() {
    return this.rolesService.getAll()
  }

  @Put(':id')
  @UseZodValidation(roleDto)
  update(@Param('id') id: string, @Body() dto: RoleDto) {
    return this.rolesService.update(id, dto)
  }

  @Post()
  @UseZodValidation(roleDto)
  create(@Body() dto: RoleDto) {
    return this.rolesService.create(dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rolesService.delete(id)
  }
}
