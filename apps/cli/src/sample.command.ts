import { Command, CommandRunner, Option } from 'nest-commander';
import { Logger } from '@nestjs/common';

@Command({ name: 'sample', description: 'A sample command' })
export class SampleCommand extends CommandRunner {
    private readonly logger = new Logger(SampleCommand.name);

    async run(
        passedParam: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        this.logger.log('Sample command running!');
        this.logger.log(`Params: ${JSON.stringify(passedParam)}`);
        this.logger.log(`Options: ${JSON.stringify(options)}`);
    }

    @Option({
        flags: '-n, --name [name]',
        description: 'A name option',
    })
    parseName(val: string): string {
        return val;
    }
}
