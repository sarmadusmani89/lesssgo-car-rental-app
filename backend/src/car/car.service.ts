import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) { }

  create(createCarDto: CreateCarDto) {
    const car = this.carRepo.create(createCarDto);
    return this.carRepo.save(car);
  }

  findAll() {
    return this.carRepo.find();
  }

  async findOne(id: number) {
    const car = await this.carRepo.findOneBy({ id });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.findOne(id);
    Object.assign(car, updateCarDto);
    return this.carRepo.save(car);
  }

  async remove(id: number) {
    const car = await this.findOne(id);
    return this.carRepo.remove(car);
  }
}
