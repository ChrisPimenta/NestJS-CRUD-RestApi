import { ForbiddenException, Injectable } from '@nestjs/common';
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
                userId,
                ...dto
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

    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark: Bookmark = await this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookmarkId
            }
        })

        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        // Find the bookmark they are trying to edit
        const bookmark: Bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            },
        })

        // User can only edit their own bookmarks
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException(
                'Access to resources denied',
            );
        }

        // Update the bookmark
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        // Find the bookmark they are trying to edit
        const bookmark: Bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            },
        })

        // User can only edit their own bookmarks
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException(
                'Access to resources denied',
            );
        }

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
