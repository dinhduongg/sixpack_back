import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common/decorators'

import { UseZodValidation } from 'src/decorators/zod.decorator'
import { EmployeesService } from './employees.service'
import { ChangePasswordDTO, EmployeeDTO, UpdateEmployeeDTO, changePasswordDto, employeeDTO, updateEmployeeDto } from './employees.validator'
import { GetQuery } from 'src/decorators/get-query.decorator'
import { CommonQuery } from 'src/types/commom.type'

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

  // Thêm hoặc xóa quyền
  @Put('role/:employee_id/:role_id')
  updateRole(@Param('employee_id') employeeId: string, @Param('role_id') roleId: string) {
    return this.employeesService.updateRole(employeeId, roleId)
  }
}
