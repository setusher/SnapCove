import { useNavigate } from "react-router-dom"
import { Calendar, Share2, Lock, Search, Download, Users } from "lucide-react"

export default function Landing() {
  const nav = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: 'Organize Events',
      description: 'Create and manage event galleries with ease. Structure your photos by event, date, and location.'
    },
    {
      icon: Share2,
      title: 'Collaborative Sharing',
      description: 'Team upload and curation. Multiple photographers can contribute to the same event gallery.'
    },
    {
      icon: Lock,
      title: 'Secure Cloud Storage',
      description: 'Reliable and protected storage for all your memories. Your photos are safe and accessible.'
    },
    {
      icon: Search,
      title: 'Easy Discovery',
      description: 'Tag and search functionality makes finding specific photos effortless. Filter by photographer or tagged person.'
    },
    {
      icon: Download,
      title: 'Download Options',
      description: 'Bulk downloads for members. Download individual photos or entire albums with one click.'
    },
    {
      icon: Users,
      title: 'Privacy Controls',
      description: 'Manage who sees what. Control visibility and access to ensure the right people see the right photos.'
    }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--primary-bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header 
        className="flex-between" 
        style={{ 
          padding: 'var(--space-6) var(--space-8)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          background: 'var(--primary-bg)',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 17, 40, 0.8)'
        }}
      >
        <div 
          className="flex-center" 
          style={{ gap: 'var(--space-2)' }}
        >
          <div 
            className="flex-center"
            style={{ 
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-button)',
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--accent)',
              letterSpacing: '-0.5px'
            }}
          >
            S
          </div>
          <span 
            className="heading-md" 
            style={{ 
              fontWeight: 600,
              letterSpacing: '-0.3px'
            }}
          >
            SnapCove
          </span>
        </div>
        <button
          onClick={() => nav("/login")}
          className="btn btn-ghost"
          style={{ padding: '10px 20px' }}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section style={{
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)'
      }}>
        <div 
          className="container" 
          style={{ 
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Your Campus Events,<br />Beautifully Organized
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-10)',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Organize, share, and preserve your campus events with a professional photo management platform designed for modern campuses.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
          <button
            onClick={() => nav("/signup")}
            className="btn btn-primary"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn btn-ghost"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 500,
                border: '1px solid var(--border-subtle)'
              }}
            >
              See How It Works
          </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        style={{
          paddingTop: 'var(--space-16)',
          paddingBottom: 'var(--space-16)',
          paddingLeft: 'var(--space-6)',
          paddingRight: 'var(--space-6)',
          background: 'var(--secondary-bg)'
        }}
      >
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--space-12)'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 36px)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.01em'
            }}>
              Why SnapCove
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--secondary-text)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Everything you need to manage campus event photography in one place
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {features.map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: 'var(--space-8)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-button)',
                    background: 'var(--elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    color: 'var(--accent)'
                  }}>
                    <IconComponent size={24} strokeWidth={1.5} />
        </div>

                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-3)'
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'var(--secondary-text)',
                    margin: 0
                  }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-8)',
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            {[
              { number: '500+', label: 'Events Organized' },
              { number: '10,000+', label: 'Photos Shared' },
              { number: '50+', label: 'Campuses' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                style={{
                  padding: 'var(--space-4)',
                  borderRight: idx < 2 ? '1px solid var(--border-subtle)' : 'none'
                }}
                className="landing-stat-item"
              >
                <div style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '-0.02em'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--secondary-text)',
                  fontWeight: 400
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--secondary-bg)'
      }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 36px)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.01em'
            }}>
              Ready to get started?
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--secondary-text)',
              marginBottom: 'var(--space-8)',
              lineHeight: 1.6
            }}>
              Start organizing your campus events today. Create your first event gallery in minutes.
            </p>
            <button
              onClick={() => nav("/signup")}
              className="btn btn-primary"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Create Your First Event
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-12)',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--primary-bg)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-8)'
          }}>
            <div>
              <div 
                className="flex-center" 
                style={{ 
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-4)',
                  justifyContent: 'flex-start'
                }}
              >
                <div 
                  className="flex-center"
                  style={{ 
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-button)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--accent)',
                    letterSpacing: '-0.5px'
                  }}
                >
                  S
                </div>
                <span 
                  className="heading-md" 
                  style={{ 
                    fontWeight: 600,
                    letterSpacing: '-0.3px'
                  }}
                >
                  SnapCove
                </span>
              </div>
              <p style={{
                fontSize: '14px',
                color: 'var(--secondary-text)',
                lineHeight: 1.6,
                margin: 0
              }}>
                Professional photo management for campus events.
              </p>
            </div>

            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                Product
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)'
              }}>
                {['Features', 'Pricing', 'About'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (link === 'Features') {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    style={{
                      fontSize: '14px',
                      color: 'var(--secondary-text)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary-text)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                Legal
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)'
              }}>
                {['Privacy', 'Terms', 'Contact'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontSize: '14px',
                      color: 'var(--secondary-text)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary-text)'}
                  >
                    {link}
                  </a>
          ))}
        </div>
      </div>
          </div>

          <div style={{
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '13px',
              color: 'var(--secondary-text)',
              margin: 0
            }}>
              © {new Date().getFullYear()} SnapCove. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
