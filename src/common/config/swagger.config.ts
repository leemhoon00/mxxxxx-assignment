import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('Motion Labs API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
