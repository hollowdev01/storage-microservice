import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Thumbnail } from './thumbnail.entity';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  uploadedBy?: string;

  @OneToMany(() => Thumbnail, (thumbnail) => thumbnail.file, {
    cascade: ['insert'],
  })
  thumbnails: Thumbnail[];
}
