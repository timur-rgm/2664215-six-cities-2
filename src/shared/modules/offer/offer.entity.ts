import { prop, modelOptions, defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { OfferType } from '../../types/index.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class OfferEntity extends defaultClasses.TimeStamps implements OfferType { // eslint-disable-line @typescript-eslint/no-unsafe-declaration-merging
  @prop({ required: true, trim: true })
  public title: string;
}

export const OfferModel = getModelForClass(OfferEntity);
