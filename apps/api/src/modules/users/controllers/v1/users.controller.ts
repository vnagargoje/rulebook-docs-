import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Request } from 'express';
import { AccessService } from '@yugo/nestjs-casl';
import { UserEntity, RoleEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload } from '../../dtos/payloads';
import { UserResponse } from '../../dtos/responses';
import { type Static } from '@sinclair/typebox';
import { ApiResource } from '@/decorators/api-resource.decorator';
import { Actions, UserSubject } from '@yugo/permissions';
import { AppAuthGuard } from '@/guards/app.guard';

const PAGINATE_CONFIG: PaginateConfig<UserEntity> = {
    sortableColumns: ['id', 'firstName', 'lastName', 'createdAt'],
    searchableColumns: ['firstName', 'lastName', 'email', 'mobilenumber'],
    defaultLimit: 50,
    filterableColumns: {
        firstName: [FilterOperator.ILIKE],
        lastName: [FilterOperator.ILIKE],
        email: [FilterOperator.EQ, FilterOperator.ILIKE],
        mobilenumber: [FilterOperator.EQ, FilterOperator.ILIKE],
        'roles.name': [FilterOperator.EQ, FilterOperator.IN],
    },
    relations: ['roles'],
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'users', version: '1' })
export class V1UsersController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
    ) {}

    @ApiResource(UserResponse, PAGINATE_CONFIG)
    @Get()
    async getManyUsers(@Paginate() query: PaginateQuery, @Req() req: Request) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new UserSubject(),
            )
        ) {
            throw new ForbiddenException(
                'You are not allowed to access all users',
            );
        }
        const queryBuilder = this.datasource.manager.createQueryBuilder(
            UserEntity,
            'user',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @ApiResource(UserResponse)
    @Get(':id')
    async getOneUser(@Param('id') id: string, @Req() req: Request) {
        const canManageUsers = this.accessService.hasAbility(
            req.user,
            Actions.create,
            new UserSubject(),
        );
        if (id !== 'me' && !canManageUsers) {
            throw new ForbiddenException('not allowed');
        }
        const userId = id === 'me' ? req.user.id : id;
        const user = await this.datasource.manager.findOne(UserEntity, {
            where: { id: userId },
            relations: { roles: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @ApiBody({ schema: CreateUserPayload })
    @ApiResource(UserResponse)
    @Post()
    async createOneUser(
        @Body() body: Static<typeof CreateUserPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new UserSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }

        return this.datasource.transaction(async (manager) => {
            const existingUser = await manager.findOne(UserEntity, {
                where: [
                    { mobilenumber: body.mobilenumber },
                    ...(body.email ? [{ email: body.email }] : []),
                ],
            });

            if (existingUser) {
                if (existingUser.mobilenumber === body.mobilenumber) {
                    throw new BadRequestException(
                        `User with mobile number ${body.mobilenumber} already exists`,
                    );
                }

                if (body.email && existingUser.email === body.email) {
                    throw new BadRequestException(
                        `User with email ${body.email} already exists`,
                    );
                }
            }

            const role = await manager.findOne(RoleEntity, {
                where: { name: body.role },
            });

            if (!role) {
                throw new BadRequestException(
                    `User role ${body.role} does not exist`,
                );
            }

            const roles: RoleEntity[] = [role];

            const user = manager.create(UserEntity, {
                email: body.email,
                mobilenumber: body.mobilenumber,
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                properties: body.properties,
                dateOfBirth: body.dateOfBirth,
                roles,
            });

            return manager.save(user);
        });
    }

    @ApiBody({ schema: UpdateUserPayload })
    @ApiResource(UserResponse)
    @Patch(':id')
    async patchOneUser(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateUserPayload>,
        @Req() req: Request,
    ) {
        const canManageUsers = this.accessService.hasAbility(
            req.user,
            Actions.create,
            new UserSubject(),
        );

        if (id !== 'me' && !canManageUsers) {
            throw new ForbiddenException('not allowed');
        }

        const userId = id === 'me' ? req.user.id : id;

        return this.datasource.transaction(async (manager) => {
            const user = await manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (body.mobilenumber || body.email) {
                const conflictUser = await manager.findOne(UserEntity, {
                    where: [
                        ...(body.mobilenumber
                            ? [{ mobilenumber: body.mobilenumber }]
                            : []),
                        ...(body.email ? [{ email: body.email }] : []),
                    ],
                });

                if (conflictUser && conflictUser.id !== user.id) {
                    if (
                        body.mobilenumber &&
                        conflictUser.mobilenumber === body.mobilenumber
                    ) {
                        throw new BadRequestException(
                            'Mobile number already in use',
                        );
                    }
                    if (body.email && conflictUser.email === body.email) {
                        throw new BadRequestException('Email already in use');
                    }
                }
            }

            if (canManageUsers && id !== 'me' && body.role) {
                let role = await manager.findOne(RoleEntity, {
                    where: { name: body.role },
                });
                if (!role) {
                    role = manager.create(RoleEntity, { name: body.role });
                    await manager.save(role);
                }
                user.roles = [role];
            }

            const { role, ...updateData } = body;
            Object.assign(user, updateData);

            return manager.save(user);
        });
    }
}
