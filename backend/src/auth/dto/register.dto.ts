import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
    password!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(80)
    displayName!: string;
}
