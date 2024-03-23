import { Body, Controller, Get, Param, Post } from '@nestjs/common/decorators'

import { UseZodValidation } from 'src/decorators/zod.decorator'
import { EmployeesService } from './employees.service'
import { EmployeeDTO, employeeDTO } from './employees.validator'

@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseZodValidation(employeeDTO)
  create(@Body() body: EmployeeDTO) {
    return this.employeesService.create(body)
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.employeesService.getDetail(id)
  }
}
