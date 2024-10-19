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

  @Column({ nullable: true })
  fileName: string;

  @Column()
  size: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  uploadedBy?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean = true;

  @OneToMany(() => Thumbnail, (thumbnail) => thumbnail.file, {
    cascade: ['insert'],
    eager: true,
  })
  thumbnails: Thumbnail[];
}
