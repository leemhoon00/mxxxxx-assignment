import { Module } from '@nestjs/common';
import { globalPipe } from './core/pipe/global.pipe';

@Module({
  imports: [],
  providers: [globalPipe],
})
export class AppModule {}
