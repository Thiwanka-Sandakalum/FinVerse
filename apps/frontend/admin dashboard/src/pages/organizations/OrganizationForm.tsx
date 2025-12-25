import { useForm } from '@mantine/form'
import {
    Stack,
    TextInput,
    Select,
    Textarea,
    Button,
    Group,
    Grid,
    MultiSelect,
    LoadingOverlay
} from '@mantine/core'
import type { Organization } from '../../types/user'

export interface OrganizationFormData {
    name: string
    display_name: string
    description: string
    industryType: string
    registrationNumber: string
    country: string
    region: string
    headquartersAddress: string
    contactEmail: string
    contactPhone: string
    website: string
    establishedYear: string
    supportedProducts: string[]
    numberOfBranches: string
    numberOfEmployees: string
    logoUrl: string
    swiftCode: string
}

interface OrganizationFormProps {
    organization?: Organization
    onSubmit: (organizationData: any) => Promise<void>
    loading?: boolean
    submitLabel?: string
}

export default function OrganizationForm({
    organization,
    onSubmit,
    loading = false,
    submitLabel = 'Save Organization'
}: OrganizationFormProps) {
    const form = useForm<OrganizationFormData>({
        initialValues: {
            name: organization?.name || '',
            display_name: organization?.display_name || '',
            description: organization?.metadata?.description || '',
            industryType: organization?.metadata?.industryType || '',
            registrationNumber: organization?.metadata?.registrationNumber || '',
            country: organization?.metadata?.country || '',
            region: organization?.metadata?.region || '',
            headquartersAddress: organization?.metadata?.headquartersAddress || '',
            contactEmail: organization?.metadata?.contactEmail || '',
            contactPhone: organization?.metadata?.contactPhone || '',
            website: organization?.metadata?.website || '',
            establishedYear: organization?.metadata?.establishedYear || '',
            supportedProducts: organization?.metadata?.supportedProducts || [],
            numberOfBranches: organization?.metadata?.numberOfBranches || '',
            numberOfEmployees: organization?.metadata?.numberOfEmployees || '',
            logoUrl: organization?.metadata?.logoUrl || '',
            swiftCode: organization?.metadata?.swiftCode || ''
        },
        validate: {
            name: (value) => (value ? null : 'Organization name is required'),
            contactEmail: (value) => {
                if (!value) return null
                return /^\S+@\S+$/.test(value) ? null : 'Invalid email format'
            },
            website: (value) => {
                if (!value) return null
                try {
                    new URL(value.startsWith('http') ? value : `https://${value}`)
                    return null
                } catch {
                    return 'Invalid website URL'
                }
            }
        }
    })

    const industryTypeOptions = [
        { value: 'Bank', label: 'Bank' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Fintech', label: 'Fintech' },
        { value: 'CreditUnion', label: 'Credit Union' },
        { value: 'InvestmentFirm', label: 'Investment Firm' },
        { value: 'PaymentProvider', label: 'Payment Provider' },
        { value: 'Microfinance', label: 'Microfinance' },
        { value: 'LeasingCompany', label: 'Leasing Company' },
        { value: 'FinanceCompany', label: 'Finance Company' },
        { value: 'StockBroker', label: 'Stock Broker' },
        { value: 'UnitTrust', label: 'Unit Trust' },
        { value: 'PawnBroker', label: 'Pawn Broker' },
        { value: 'MoneyTransfer', label: 'Money Transfer' },
        { value: 'DevelopmentBank', label: 'Development Bank' },
        { value: 'CooperativeSociety', label: 'Cooperative Society' },
        { value: 'InsuranceBroker', label: 'Insurance Broker' },
        { value: 'Other', label: 'Other' }
    ]

    const supportedProductsOptions = [
        'SavingsAccount', 'CurrentAccount', 'FixedDeposit', 'PersonalLoan', 'HomeLoan',
        'Leasing', 'Microfinance', 'CreditCard', 'DebitCard', 'Insurance', 'LifeInsurance',
        'GeneralInsurance', 'Investment', 'StockTrading', 'UnitTrust', 'Remittance',
        'MobileBanking', 'InternetBanking', 'PaymentGateway', 'PawnBroking', 'Other'
    ].map(product => ({ value: product, label: product.replace(/([A-Z])/g, ' $1').trim() }))

    const handleSubmit = async (values: OrganizationFormData) => {
        try {
            const organizationData = {
                name: values.name,
                display_name: values.display_name,
                metadata: {
                    description: values.description,
                    industryType: values.industryType as Organization['metadata']['industryType'],
                    registrationNumber: values.registrationNumber,
                    country: values.country,
                    region: values.region,
                    headquartersAddress: values.headquartersAddress,
                    contactEmail: values.contactEmail,
                    contactPhone: values.contactPhone,
                    website: values.website,
                    establishedYear: values.establishedYear,
                    supportedProducts: values.supportedProducts as Organization['metadata']['supportedProducts'],
                    numberOfBranches: values.numberOfBranches,
                    numberOfEmployees: values.numberOfEmployees,
                    logoUrl: values.logoUrl,
                    swiftCode: values.swiftCode
                }
            }
            await onSubmit(organizationData)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md" pos="relative">
                <LoadingOverlay visible={loading} />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Organization Name"
                            placeholder="Enter organization name"
                            required
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Display Name"
                            placeholder="Enter display name"
                            {...form.getInputProps('display_name')}
                        />
                    </Grid.Col>
                </Grid>

                <Textarea
                    label="Description"
                    placeholder="Enter organization description"
                    rows={3}
                    {...form.getInputProps('description')}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            label="Industry Type"
                            placeholder="Select industry type"
                            data={industryTypeOptions}
                            {...form.getInputProps('industryType')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Registration Number"
                            placeholder="Enter registration number"
                            {...form.getInputProps('registrationNumber')}
                        />
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Country"
                            placeholder="Enter country"
                            {...form.getInputProps('country')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Region"
                            placeholder="Enter region"
                            {...form.getInputProps('region')}
                        />
                    </Grid.Col>
                </Grid>

                <Textarea
                    label="Headquarters Address"
                    placeholder="Enter headquarters address"
                    rows={2}
                    {...form.getInputProps('headquartersAddress')}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Contact Email"
                            placeholder="contact@organization.com"
                            type="email"
                            {...form.getInputProps('contactEmail')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Contact Phone"
                            placeholder="Enter contact phone"
                            {...form.getInputProps('contactPhone')}
                        />
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Website"
                            placeholder="https://www.organization.com"
                            {...form.getInputProps('website')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Established Year"
                            placeholder="2020"
                            {...form.getInputProps('establishedYear')}
                        />
                    </Grid.Col>
                </Grid>

                <MultiSelect
                    label="Supported Products"
                    placeholder="Select supported products"
                    data={supportedProductsOptions}
                    {...form.getInputProps('supportedProducts')}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Number of Branches"
                            placeholder="10"
                            {...form.getInputProps('numberOfBranches')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Number of Employees"
                            placeholder="100"
                            {...form.getInputProps('numberOfEmployees')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="SWIFT Code"
                            placeholder="ABCDLKLX"
                            {...form.getInputProps('swiftCode')}
                        />
                    </Grid.Col>
                </Grid>

                <TextInput
                    label="Logo URL"
                    placeholder="https://example.com/logo.png"
                    {...form.getInputProps('logoUrl')}
                />

                <Group justify="flex-end" mt="xl">
                    <Button type="submit" loading={loading}>
                        {submitLabel}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
