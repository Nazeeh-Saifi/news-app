<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['html_content'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'title',
        'user_id'
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    public function getHtmlContentAttribute()
    {
        $decodedContent = json_decode($this->attributes['content'], true);
        $contentBlocks = $decodedContent["blocks"];
        $htmlOutput = '';

        foreach ($contentBlocks as $key => $block) {
            # code...
            switch ($block["type"]) {
                case 'paragraph':
                    # code...
                    $htmlOutput .= '<div><p>' . $block["data"]["text"] . '</p></div>';
                    break;

                case 'header':
                    $htmlOutput .= '<div><h' . $block["data"]["level"] . '>' .   $block["data"]["text"] . '</h' . $block["data"]["level"] . '></div>';
                    break;

                case 'image':
                    $htmlOutput .= '<div><img src=' . $block["data"]["url"] . '></div>';
                    break;
                case 'list':
                    $outterElement = $block["data"]["style"] == 'ordered' ? 'ol' : 'ul';
                    $innerItems = '';
                    foreach ($block["data"]["items"] as $key => $listItem) {
                        # code...
                        $innerItems .= '<li>' . $listItem . '</li>';
                    }
                    $htmlOutput .= '<div><' . $outterElement . '>' .   $innerItems . '</' . $outterElement . '></div>';
                    break;
                default:
                    # code...
                    break;
            }
        }
        return  $htmlOutput;
    }
    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}