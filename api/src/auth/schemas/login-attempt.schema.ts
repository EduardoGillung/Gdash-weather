import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LoginAttempt extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  userAgent: string;

  @Prop({ required: true })
  success: boolean;

  @Prop()
  failureReason?: string;

  @Prop()
  userId?: string;
}

export const LoginAttemptSchema =
  SchemaFactory.createForClass(LoginAttempt);
