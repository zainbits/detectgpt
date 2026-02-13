import { useState, useMemo } from 'react'
import {
  Container,
  Title,
  Text,
  Textarea,
  Button,
  Group,
  Badge,
  Paper,
  Stack,
  CopyButton,
  Tooltip,
  Table,
  Divider,
  Box,
} from '@mantine/core'
import { detectNonAscii, cleanText, CATEGORY_INFO, type Detection } from './unicode-map'

function App() {
  const [input, setInput] = useState('')

  const detections = useMemo(() => detectNonAscii(input), [input])
  const cleaned = useMemo(() => cleanText(input), [input])

  // Group detections by category for summary badges
  const summary = useMemo(() => {
    const map: Record<string, Detection[]> = {}
    for (const d of detections) {
      const cat = d.entry.category
      if (!map[cat]) map[cat] = []
      map[cat].push(d)
    }
    return map
  }, [detections])

  // Deduplicate detections for the table (unique by codePoint)
  const uniqueDetections = useMemo(() => {
    const seen = new Set<string>()
    const result: (Detection & { count: number })[] = []
    for (const d of detections) {
      if (!seen.has(d.entry.codePoint)) {
        seen.add(d.entry.codePoint)
        result.push({
          ...d,
          count: detections.filter((x) => x.entry.codePoint === d.entry.codePoint).length,
        })
      }
    }
    return result
  }, [detections])

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'var(--mantine-color-dark-8)',
      }}
    >
      <Container size="md" py="xl">
        <Stack gap="lg">
          {/* ── Row 1: Heading ──────────────────────────────────── */}
          <Box ta="center">
            <Title order={1} fw={800} size="2rem">
              DetectGPT
            </Title>
            <Text c="dimmed" size="md" mt={4}>
              Detect non-ASCII characters left as watermarks by AI
            </Text>
          </Box>

          {/* ── Row 2: Input ───────────────────────────────────── */}
          <Paper withBorder p="md" radius="md">
            <Textarea
              label="Paste text to scan"
              placeholder={'Paste AI-generated text here\u2026\n\nExample: \u201CHello world\u201D \u2014 let\u2019s check.'}
              autosize
              minRows={6}
              maxRows={16}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              styles={{
                input: {
                  fontFamily: 'monospace',
                  fontSize: 14,
                },
              }}
            />

            {/* Summary badges */}
            {detections.length > 0 && (
              <Group mt="sm" gap="xs">
                <Badge variant="filled" color="gray" size="lg">
                  {detections.length} issue{detections.length !== 1 ? 's' : ''} found
                </Badge>
                {Object.entries(summary).map(([cat, items]) => {
                  const info = CATEGORY_INFO[cat]
                  return (
                    <Badge key={cat} variant="light" color={info.color} size="lg">
                      {info.label}: {items.length}
                    </Badge>
                  )
                })}
              </Group>
            )}

            {detections.length === 0 && input.length > 0 && (
              <Badge mt="sm" variant="light" color="green" size="lg">
                Clean - no non-ASCII watermarks detected
              </Badge>
            )}
          </Paper>

          {/* ── Row 3: Cleaned output + Copy ───────────────────── */}
          {input.length > 0 && (
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="sm">
                  Cleaned Output
                </Text>
                <CopyButton value={cleaned} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy cleaned text'} withArrow>
                      <Button
                        variant={copied ? 'filled' : 'light'}
                        color={copied ? 'teal' : 'violet'}
                        size="xs"
                        onClick={copy}
                      >
                        {copied ? 'Copied!' : 'Copy Cleaned'}
                      </Button>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
              <Textarea
                readOnly
                autosize
                minRows={4}
                maxRows={16}
                value={cleaned}
                styles={{
                  input: {
                    fontFamily: 'monospace',
                    fontSize: 14,
                    cursor: 'default',
                  },
                }}
              />
            </Paper>
          )}

          {/* ── Detection Details Table ────────────────────────── */}
          {uniqueDetections.length > 0 && (
            <Paper withBorder p="md" radius="md">
              <Text fw={600} size="sm" mb="xs">
                Detected Characters
              </Text>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Character</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Code Point</Table.Th>
                    <Table.Th>Replaced With</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th ta="center">Count</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {uniqueDetections.map((d) => {
                    const info = CATEGORY_INFO[d.entry.category]
                    return (
                      <Table.Tr key={d.entry.codePoint}>
                        <Table.Td ff="monospace" fw={700}>
                          {d.entry.category === 'invisible'
                            ? `[${d.entry.codePoint}]`
                            : `"${d.char}"`}
                        </Table.Td>
                        <Table.Td>{d.entry.name}</Table.Td>
                        <Table.Td ff="monospace">{d.entry.codePoint}</Table.Td>
                        <Table.Td ff="monospace">
                          {d.entry.replacement === ''
                            ? '(removed)'
                            : `"${d.entry.replacement}"`}
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" color={info.color} size="sm">
                            {info.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center" fw={600}>
                          {d.count}
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>
            </Paper>
          )}

          {/* Footer */}
          <Divider />
          <Text ta="center" size="xs" c="dimmed">
            DetectGPT scans for "smart quotes", em/en dashes, zero-width spaces, invisible Unicode, and other non-ASCII artifacts commonly left by AI models.
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
