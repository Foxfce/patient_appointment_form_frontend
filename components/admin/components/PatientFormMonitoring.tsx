'use client'

import { useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns'
import {
    countryOptions,
    GENDERS,
    PatientFormSchema,
    languagesOptions
} from '../../../libs/utils/validator';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../ui/form';
import { Input } from '../../ui/input';
import {
    Popover,
    PopoverTrigger
} from '@radix-ui/react-popover';
import { Button } from '../../ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '../../ui/command';
import {
    CalendarIcon,
    Check,
    ChevronsUpDown
} from 'lucide-react';
import { PopoverContent } from '../../ui/popover';
import { cn } from "@/lib/utils"
import { Calendar } from '../../ui/calendar';
import {
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
    Select
} from '../../ui/select';

type Props = {
    data : any;
}

function PatientFormMonitoring({data}: Props) {
    const form = useForm({
        resolver: zodResolver(PatientFormSchema),
    });

    useEffect(() => {
        if (data) {
            form.reset(data); 
        }
    }, [data]);

    return (
        <div className='p-4 max-w-3xl mx-auto'>
            <h1 className='text-2xl font-semibold mb-4'>Patient Form</h1>
            <Form {...form}>
                <form
                    className='space-y-4'
                >
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={true}>
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
                            disabled={true}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild disabled={true}>
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
                                                disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Language</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild disabled={true}>
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
                            disabled={true}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Nationality</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild disabled={true}>
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
                            disabled={true}
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
                            disabled={true}
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
                        disabled={true}
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
                </form>
            </Form>
        </div>
    )
}

export default PatientFormMonitoring