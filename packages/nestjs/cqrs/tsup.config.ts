import { defineConfig } from 'tsup'

export default defineConfig( {
    entry: [ 'src/index.ts' ],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: [ 'cjs', 'esm' ],
    external: [
        '@nestjs/common',
        '@nestjs/core',
        '@nestjs/cqrs',
        '@nestjs/typeorm',
        '@yugo/nestjs-database',
        '@yugo/nestjs-fcm',
        '@yugo/shared',
        'reflect-metadata',
        'rxjs',
        'typeorm',
        'nestjs-paginate',
    ],
} )
