import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new vehicle' })
    create(@Body() createVehicleDto: any) {
        return this.vehicleService.create(createVehicleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all vehicles' })
    findAll() {
        return this.vehicleService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get vehicle by ID' })
    findOne(@Param('id') id: string) {
        return this.vehicleService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update vehicle' })
    update(@Param('id') id: string, @Body() updateVehicleDto: any) {
        return this.vehicleService.update(id, updateVehicleDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete vehicle' })
    remove(@Param('id') id: string) {
        return this.vehicleService.remove(id);
    }
}
