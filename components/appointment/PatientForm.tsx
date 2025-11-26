'use client'

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns'
import {
    countryOptions,
    GENDERS,
    PatientFormInput,
    PatientFormSchema,
    languagesOptions
} from '../../libs/utils/validator';
import {
    GENERAL_EVENT,
    PATIENT_EVENT,
    PATIENT_STATUS, USER_ROLE
} from '@/libs/constants/socket.constant';
import { CountryCode, Languages } from '@/libs/nationality';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import {
    Popover,
    PopoverTrigger
} from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '../ui/command';
import {
    CalendarIcon,
    Check,
    ChevronsUpDown
} from 'lucide-react';
import { PopoverContent } from '../ui/popover';
import { cn } from "@/lib/utils"
import { Calendar } from '../ui/calendar';
import {
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
    Select
} from '../ui/select';

let socket: ReturnType<typeof io> | null = null;
let IDLE_COUNTDOWN_TIMER_SECOND: number = 10;

function PatientForm() {
    const [sessionId] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('session') || uuidv4();
        }

        return 'unknown';
    });

    // const { register, handleSubmit, watch, formState } = useForm({
    const form = useForm({
        resolver: zodResolver(PatientFormSchema),
        defaultValues: {
            middleName: null,
        }
    });
    const { register, handleSubmit, watch, formState } = form;
    const watchAll = watch();
    const idleTimer = useRef<number | null>(null);
    const { isSubmitting, isSubmitted, errors } = formState;

    // Emit when enter or exit form page
    useEffect(() => {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
        socket.emit(GENERAL_EVENT.JOIN, { sessionId, role: USER_ROLE.PATIENT });

        return () => {
            socket?.disconnect();
        };
    }, [sessionId]);

    // Emit when patient filling form
    useEffect(() => {
        if (!socket || isSubmitted || isSubmitting) return;
        socket?.emit(PATIENT_EVENT.UPDATE, { sessionId, payload: watchAll });
        socket?.emit(PATIENT_EVENT.STATUS, { sessionId, status: PATIENT_STATUS.FILLING });

        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => {
            socket?.emit(PATIENT_EVENT.STATUS, { sessionId, status: PATIENT_STATUS.IDLE });
        }, IDLE_COUNTDOWN_TIMER_SECOND * 1000);

        console.log('sessionId , watchAll trigger');
    }, [watchAll, sessionId]);

    const onSubmit = (data: PatientFormInput) => {
        socket?.emit(PATIENT_EVENT.UPDATE, { sessionId, payload: data });
        socket?.emit(PATIENT_EVENT.STATUS, { sessionId, status: PATIENT_STATUS.SUBMIT });
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        // Add proper alert later!!!
        alert('Form Submitted - thank you!');
    }

    return (
        <div className='p-4 max-w-3xl mx-auto'>
            <h1 className='text-2xl font-semibold mb-4'>Patient Form</h1>
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Middle name"
                                            value={field.value ?? ''} />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Last name"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Date of birth, gender, phone, email, address, preferred language, nationality, emergency contact, religion */}
                    {/* Use appropriate input types and simple validation (react-hook-form) */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-[200px]'>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                GENDERS.map(gender => (
                                                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-60 pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                captionLayout='dropdown'
                                                disabled={(date: any) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='phone'
                                            placeholder="Phone number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input
                                        {...field}
                                        className="bg-background"
                                        id="email"
                                        placeholder="example@email.com"
                                        type="email"
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='input'
                                            placeholder="Address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            name="preferredLanguage"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Language</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ?
                                                        languagesOptions.find(
                                                            (language) => language.value === field.value
                                                        )?.label
                                                        : "Select language"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search language..." />
                                                <CommandList>
                                                    <CommandEmpty>No language found.</CommandEmpty>
                                                    <CommandGroup>{
                                                        languagesOptions.map((language) => (
                                                            <CommandItem
                                                                value={language.label}
                                                                key={language.value}
                                                                onSelect={() => {
                                                                    form.setValue("preferredLanguage", language.value)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        language.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {language.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Nationality</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ?
                                                        countryOptions.find(
                                                            (country) => country.value === field.value
                                                        )?.name
                                                        : "Select country"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..." />
                                                <CommandList>
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup>{
                                                        countryOptions.map((country) => (
                                                            <CommandItem
                                                                value={country.value}
                                                                key={country.value}
                                                                onSelect={() => {
                                                                    form.setValue("nationality", country.value)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        country.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {country.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="religion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Religion (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Religion"
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <h2 className='block font-semibold text-sm'>Emergency Contact (Optional)</h2>

                    <div>
                        <FormField
                            control={form.control}
                            name="emergencyContact.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Name"
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="emergencyContact.relationship"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Relationship"
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='w-full flex justify-end'>
                        <Button type='submit' className='btn w-full md:w-30'>Submit</Button>
                    </div>
                </form>
            </Form>

            <span className='mt-5 text-sm text-gray-500'>
                Share this URL with staff or they can view via the staff dashboard :
                {sessionId}
            </span>

        </div>
    )
}

export default PatientForm