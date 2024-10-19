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

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  size: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  uploadedBy?: string;

  @OneToMany(() => Thumbnail, (thumbnail) => thumbnail.file, {
    cascade: ['insert'],
    eager: true,
  })
  thumbnails: Thumbnail[];
}
