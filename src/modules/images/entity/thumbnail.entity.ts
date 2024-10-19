import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Image } from './image.entity';

@Entity('thumbnail')
export class Thumbnail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({
    default: 'SMALL',
  })
  type: string;

  @ManyToOne(() => Image, (image) => image.thumbnails, { nullable: false })
  file: Image;
}
