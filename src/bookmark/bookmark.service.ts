import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark: Bookmark = await this.prisma.bookmark.create({
            data: {
                title: dto.title,
                description: dto.description,
                link: dto.link,
                userId: userId
            }
        })

        return bookmark;
    }

    async getBookmarks(userId: number) {
        const bookmarks: Bookmark[] = await this.prisma.bookmark.findMany({
            where: {
                userId
            }
        })

        return bookmarks;
    }

    getBookmarkById(userId: number, bookmarkId: number) { }

    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) { }

    deleteBookmarkById(userId: number, bookmarkId: number) { }
}
