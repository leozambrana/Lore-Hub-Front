import { Theory } from './theory'

export interface TheoryFormProps {
  initialData?: Theory
  preselectedGameId?: string
}

export interface WikiCreateFormProps {
  onSuccess?: () => void
  initialData?: any // Pode ser melhorado depois
}

export interface CommentsSectionProps {
  theoryId: string
}

export interface SidebarWidgetProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}
