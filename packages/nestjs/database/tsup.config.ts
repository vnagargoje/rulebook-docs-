import { defineConfig } from 'tsup'

export default defineConfig( {
    entry: {
        index: 'src/index.ts',
        entities: 'src/entities/index.ts',
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: [ 'cjs', 'esm' ],
    external: [ '@nestjs/common', '@nestjs/core', '@nestjs/typeorm', 'typeorm', 'reflect-metadata', 'rxjs', 'mysql2' ],
} )
