'use client'

import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { ProviderLogDto } from '@latitude-data/core/browser'
import { DocumentLogWithMetadataAndError } from '@latitude-data/core/repositories'
import {
  Alert,
  Button,
  Tooltip,
  useCurrentCommit,
  useCurrentProject,
} from '@latitude-data/web-ui'
import { useDocumentParameters } from '$/hooks/useDocumentParameters'
import { useStickyNested } from '$/hooks/useStickyNested'
import { ROUTES } from '$/services/routes'
import { useRouter } from 'next/navigation'
import { usePanelDomRef } from 'node_modules/@latitude-data/web-ui/src/ds/atoms/SplitPane'

import { MetadataInfoTabs } from '../../../../_components/MetadataInfoTabs'
import { MetadataItem } from '../../../../../[documentUuid]/_components/MetadataItem'
import { DocumentLogMessages, useGetProviderLogMessages } from './Messages'
import { DocumentLogMetadata } from './Metadata'

function DocumentLogMetadataLoading() {
  return (
    <>
      <MetadataItem label='Log uuid' loading />
      <MetadataItem label='Timestamp' loading />
      <MetadataItem label='Tokens' loading />
      <MetadataItem label='Cost' loading />
      <MetadataItem label='Duration' loading />
      <MetadataItem label='Version' loading />
    </>
  )
}

function UseDocumentLogInPlaygroundButton({
  documentLog,
}: {
  documentLog: DocumentLogWithMetadataAndError
}) {
  const { commit } = useCurrentCommit()
  const { project } = useCurrentProject()
  const documentUuid = documentLog.documentUuid
  const {
    setSource,
    history: { setHistoryLog },
  } = useDocumentParameters({
    documentVersionUuid: documentUuid,
    commitVersionUuid: commit.uuid,
  })
  const navigate = useRouter()
  const employLogAsDocumentParameters = useCallback(() => {
    setSource('history')
    setHistoryLog(documentLog.uuid)
    navigate.push(
      ROUTES.projects
        .detail({ id: project.id })
        .commits.detail({
          uuid: commit.uuid,
        })
        .documents.detail({ uuid: documentUuid }).root,
    )
  }, [
    setHistoryLog,
    setSource,
    navigate,
    project.id,
    commit.uuid,
    documentUuid,
    documentLog.uuid,
  ])
  return (
    <Tooltip
      asChild
      trigger={
        <Button
          onClick={employLogAsDocumentParameters}
          fancy
          iconProps={{ name: 'rollText', color: 'foregroundMuted' }}
          variant='outline'
          size='icon'
          containerClassName='rounded-xl pointer-events-auto'
          className='rounded-xl'
        />
      }
    >
      Use this log in the playground
    </Tooltip>
  )
}

export function DocumentLogInfo({
  documentLog,
  providerLogs,
  isLoading = false,
  error,
  className,
  tableRef,
  sidebarWrapperRef,
  children,
}: {
  documentLog: DocumentLogWithMetadataAndError
  providerLogs?: ProviderLogDto[]
  isLoading?: boolean
  error?: Error
  className?: string
  tableRef?: RefObject<HTMLTableElement>
  sidebarWrapperRef?: RefObject<HTMLDivElement>
  children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [target, setTarget] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref.current) return

    setTarget(ref.current)
  }, [ref.current])
  const scrollableArea = usePanelDomRef({ selfRef: target })
  const beacon = tableRef?.current
  useStickyNested({
    scrollableArea,
    beacon,
    target,
    targetContainer: sidebarWrapperRef?.current,
    offset: 24,
  })

  const { lastResponse, messages } = useGetProviderLogMessages({ providerLogs })
  return (
    <div className='relative border border-border rounded-lg overflow-hidden'>
      <MetadataInfoTabs
        ref={ref}
        className={className}
        tabsActions={
          <>
            {documentLog ? (
              <UseDocumentLogInPlaygroundButton documentLog={documentLog} />
            ) : null}
          </>
        }
      >
        {({ selectedTab }) =>
          isLoading ? (
            <DocumentLogMetadataLoading />
          ) : (
            <>
              {!error ? (
                <>
                  {selectedTab === 'metadata' && (
                    <DocumentLogMetadata
                      documentLog={documentLog}
                      providerLogs={providerLogs}
                      lastResponse={lastResponse}
                    />
                  )}
                  {selectedTab === 'messages' && (
                    <DocumentLogMessages messages={messages} />
                  )}
                </>
              ) : (
                <Alert
                  variant='destructive'
                  title='Error loading'
                  description={error.message}
                />
              )}
            </>
          )
        }
      </MetadataInfoTabs>
      {children}
    </div>
  )
}
