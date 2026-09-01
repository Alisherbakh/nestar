import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { MongooseModule } from '@nestjs/mongoose';
import ViewSchema from '../../schemas/View.model';

@Module({ // schema hosil qilinyabdi forFeature orqali
  imports: [MongooseModule.forFeature([{ name: "View", schema: ViewSchema}])],
  providers: [ViewService],
  exports: [ViewService], // Step 1 tashqarida foydalanish uchun
})
export class ViewModule {}
