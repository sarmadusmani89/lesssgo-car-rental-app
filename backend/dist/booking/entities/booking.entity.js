"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("../../vehicle/entities/vehicle.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const payment_entity_1 = require("../../payment/entities/payment.entity");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'vehicleId' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Booking.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Booking.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Booking.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal', precision: 10, scale: 2, transformer: {
            to: (value) => value,
            from: (value) => parseFloat(value),
        }
    }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'paid', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['cash', 'card', 'online'], default: 'cash' }),
    __metadata("design:type", String)
], Booking.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.booking),
    __metadata("design:type", Array)
], Booking.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('booking'),
    (0, typeorm_1.Index)('idx_userId', ['userId']),
    (0, typeorm_1.Index)('idx_vehicleId', ['vehicleId']),
    (0, typeorm_1.Index)('idx_vehicle_dates', ['vehicleId', 'startDate', 'endDate'])
], Booking);
//# sourceMappingURL=booking.entity.js.map