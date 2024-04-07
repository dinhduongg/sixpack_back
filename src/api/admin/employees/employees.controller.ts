import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators'

import { GetQuery } from 'src/decorators/get-query.decorator'
import { UseZodValidation } from 'src/decorators/zod.decorator'
import { CommonQuery } from 'src/types/commom.type'
import { EmployeesService } from './employees.service'
import { ChangePasswordDTO, EmployeeDTO, UpdateEmployeeDTO, changePasswordDto, employeeDTO, updateEmployeeDto } from './employees.validator'

@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseZodValidation(employeeDTO)
  create(@Body() body: EmployeeDTO) {
    return this.employeesService.create(body)
  }

  @Get()
  getAll(@GetQuery() query: CommonQuery) {
    return this.employeesService.getAll(query)
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.employeesService.getDetail(id)
  }

  // Cập nhật nhân viên
  @Put(':id')
  @UseZodValidation(updateEmployeeDto)
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDTO) {
    return this.employeesService.update(id, dto)
  }

  // Đổi mật khẩu
  @Put('password/:id')
  @UseZodValidation(changePasswordDto)
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDTO) {
    return this.employeesService.changePassword(id, dto)
  }

  // Thêm quyền
  @Post('role')
  createRole(@Body('employee_id') employeeId: string, @Body('role_id') roleId: string) {
    return this.employeesService.createRole(employeeId, roleId)
  }

  @Delete('role/:employeeId/:roleId')
  deleteRole(@Param('employeeId') employeeId: string, @Param('roleId') roleId: string) {
    return this.employeesService.deleteRole(employeeId, roleId)
  }

  // Xóa nhân viên
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.employeesService.delete(id)
  }
}
