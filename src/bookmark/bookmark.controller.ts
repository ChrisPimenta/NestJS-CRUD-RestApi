import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    // POST /bookmarks
    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    // GET /bookmarks
    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    // GET /bookmarks/5
    @Get(':bookmarkId')
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    // PATCH /bookmarks/5
    @Patch(':bookmarkId')
    editBookmarkById(
        @GetUser('id') userId: number,
        @Body() dto: EditBookmarkDto,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
    }

    // DELETE /bookmarks/5
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':bookmarkId')
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}
