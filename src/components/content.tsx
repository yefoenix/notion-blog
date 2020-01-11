import React from 'react'
import ReactJSXParser from '@zeit/react-jsx-parser'

import Heading from './heading'
import components from './dynamic'

import { textBlock } from '../lib/notion/renderers'

const listTypes = new Set(['bulleted_list', 'numbered_list'])

export default function Content({ blocks }) {
  let listTagName: string | null = null
  let listLastId: string | null = null
  let listChildren: React.ReactElement[] = []

  return <div className="content">
    {blocks.map((block, blockIdx) => {
      const { value } = block
      const { type, properties, id } = value
      const isLast = blockIdx === blocks.length - 1
      const isList = listTypes.has(type)
      let toRender = []

      if (isList) {
        listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol']
        listLastId = `list${id}`
        listChildren.push(
          React.createElement(
            components.li || 'li',
            { key: id } as any,
            textBlock(properties.title, true, id)
          )
        )
      }

      if (listTagName && (isLast || !isList)) {
        toRender.push(
          React.createElement(
            listTagName,
            { key: listLastId! },
            ...listChildren
          )
        )
        listChildren = []
        listLastId = null
        listTagName = null
      }

      const renderHeading = (Type: string | React.ComponentType) => {
        toRender.push(
          <Heading key={id}>
            <Type key={id}>{textBlock(properties.title, true, id)}</Type>
          </Heading>
        )
      }

      switch (type) {
        case 'page':
        case 'divider':
          toRender.push(<hr />)
          break
        case 'text':
          if (properties) {
            toRender.push(textBlock(properties.title, false, id))
          }
          break
        case 'image':
        case 'video': {
          const { format = {} } = value
          const { block_width } = format
          const baseBlockWidth = 768
          const roundFactor = Math.pow(10, 2)
          // calculate percentages
          const width = block_width
            ? `${Math.round(
              (block_width / baseBlockWidth) * 100 * roundFactor
            ) / roundFactor}%`
            : '100%'

          const isImage = type === 'image'
          const Comp = isImage ? 'img' : 'video'

          toRender.push(
            <Comp
              key={id}
              src={`/api/asset?assetUrl=${encodeURIComponent(
                format.display_source as any
              )}&blockId=${id}`}
              controls={!isImage}
              alt={isImage ? 'An image from Notion' : undefined}
              loop={!isImage}
              muted={!isImage}
              autoPlay={!isImage}
              style={{ width }}
            />
          )
          break
        }
        case 'header':
          renderHeading('h1')
          break
        case 'sub_header':
          renderHeading('h2')
          break
        case 'sub_sub_header':
          renderHeading('h3')
          break
        case 'code': {
          if (properties.title) {
            const content = properties.title[0][0]
            const language = properties.language[0][0]

            if (language === 'LiveScript') {
              // this requires the DOM for now
              toRender.push(
                <ReactJSXParser
                  key={id}
                  jsx={content}
                  components={components}
                  componentsOnly={false}
                  renderInpost={false}
                  allowUnknownElements={true}
                  blacklistedTags={['script', 'style']}
                />
              )
            } else {
              toRender.push(
                <components.Code key={id} language={language || ''}>
                  {content}
                </components.Code>
              )
            }
          }
          break
        }
        case 'quote':
          if (properties.title) {
            toRender.push(
              React.createElement(
                components.blockquote,
                { key: id },
                textBlock(properties.title, false, id)
              )
            )
          }
          break
        default:
          if (
            process.env.NODE_ENV !== 'production' &&
            !listTypes.has(type)
          ) {
            console.log('unknown type', type)
          }
          break
      }
      return toRender
    })}
  </div>
}