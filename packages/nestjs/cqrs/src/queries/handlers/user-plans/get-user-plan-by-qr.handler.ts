import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BookingEntity, FileEntity, PlanEntity, UserEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { GetUserPlanByQrQuery } from '../../impl/user-plans/get-user-plan-by-qr.query.js'
import { ConfigService } from '@nestjs/config'

@QueryHandler(GetUserPlanByQrQuery)
export class GetUserPlanByQrHandler implements IQueryHandler<GetUserPlanByQrQuery> {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly configService: ConfigService,
    ) {}

    async execute(query: GetUserPlanByQrQuery) {
        const { userPlanId } = query

        const userPlan = await this.manager.findOne(UserPlanEntity, {
            where: { id: userPlanId },
        })
        if (!userPlan) {
            throw new NotFoundException('User plan not found')
        }

        const user = await this.manager.findOne(UserEntity, {
            where: { id: userPlan.userId },
        })

        const plan = await this.manager.findOne(PlanEntity, {
            where: { id: userPlan.planId },
        })

        const booking = await this.manager.findOne(BookingEntity, {
            where: { userPlanId },
        })

        let qrCodeUrl: string | null = null
        if (userPlan.qrCodeId) {
            const file = await this.manager.findOne(FileEntity, {
                where: { id: userPlan.qrCodeId },
            })
            if (file) {
                const endpoint = this.configService.get<string>('s3-client.config.endpoint', 'http://localhost:9000')
                const bucket = this.configService.getOrThrow<{ bucket: string }>('s3-bucket').bucket
                qrCodeUrl = `${endpoint}/${bucket}/${file.path}`
            }
        }

        return {
            userPlan: {
                id: userPlan.id,
                status: userPlan.status,
                planSnapshot: userPlan.planSnapshot,
                remainingKm: userPlan.remainingKm,
                startsAt: userPlan.startsAt,
                expiresAt: userPlan.expiresAt,
                qrCodeUrl,
            },
            user: user
                ? {
                      id: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      mobilenumber: user.mobilenumber,
                      email: user.email,
                  }
                : null,
            plan: plan
                ? {
                      id: plan.id,
                      name: plan.name,
                  }
                : null,
            booking: booking
                ? {
                      id: booking.id,
                      status: booking.status,
                      stationId: booking.stationId,
                      vehicleId: booking.vehicleId,
                      batteryId: booking.batteryId,
                      pickupOtp: booking.pickupOtp,
                  }
                : null,
        }
    }
}
